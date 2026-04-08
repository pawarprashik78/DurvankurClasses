package com.durvankarclasses.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig {

    // Exact URI from MongoDB Atlas "Connect" button
    private static final String ATLAS_URI =
            "mongodb+srv://pawarprashik78_db_user:P12345@cluster0.xpcoanz.mongodb.net/?appName=Cluster0";

    // Database name to use (created automatically on first insert)
    private static final String DB_NAME = "durvankur_classes";

    @Bean
    public MongoClient mongoClient() {
        ConnectionString cs = new ConnectionString(ATLAS_URI);
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
        return new MongoTemplate(mongoClient, DB_NAME);
    }
}
