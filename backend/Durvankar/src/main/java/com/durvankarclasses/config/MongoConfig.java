package com.durvankarclasses.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.concurrent.TimeUnit;

/**
 * Programmatic MongoDB configuration.
 * Uses app.mongodb.uri from application.properties (supports ${MONGODB_URI} env var on Render).
 * Kept programmatic to avoid Spring auto-config conflicts with Atlas SRV URIs.
 */
@Configuration
public class MongoConfig {

    @Value("${app.mongodb.uri}")
    private String mongoUri;

    @Value("${app.mongodb.database}")
    private String mongoDatabase;

    @Bean
    public MongoClient mongoClient() {
        ConnectionString cs = new ConnectionString(mongoUri);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(cs)
                .applyToSocketSettings(s -> s
                        .connectTimeout(30, TimeUnit.SECONDS)
                        .readTimeout(30, TimeUnit.SECONDS))
                .applyToClusterSettings(c -> c
                        .serverSelectionTimeout(30, TimeUnit.SECONDS))
                .build();
        return MongoClients.create(settings);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, mongoDatabase);
    }
}
