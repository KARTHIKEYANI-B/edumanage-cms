package com.cms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import javax.sql.DataSource;

@Configuration
public class RailwayDatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${MYSQL_URL:}")
    private String mysqlUrl;

    @Value("${MYSQL_USER:}")
    private String mysqlUser;

    @Value("${MYSQL_PASSWORD:}")
    private String mysqlPassword;

    @Value("${DATABASE_USERNAME:root}")
    private String dbUsername;

    @Value("${DATABASE_PASSWORD:@Boomab12345}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = resolveUrl();
        String username = resolveUsername();
        String password = resolvePassword();

        System.out.println("✅ Connecting to database: " + url.split("\\?")[0]);

        return DataSourceBuilder.create()
            .driverClassName("com.mysql.cj.jdbc.Driver")
            .url(url)
            .username(username)
            .password(password)
            .build();
    }

    private String resolveUrl() {
        // Try MYSQL_URL first (Railway MySQL plugin)
        if (mysqlUrl != null && !mysqlUrl.isEmpty()) {
            return convertToJdbc(mysqlUrl);
        }
        // Try DATABASE_URL next
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            return convertToJdbc(databaseUrl);
        }
        // Fallback to local
        return "jdbc:mysql://localhost:3306/course_management_db" +
               "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    }

    private String convertToJdbc(String url) {
        // Already correct format
        if (url.startsWith("jdbc:mysql://")) return url;
        if (url.startsWith("jdbc:")) return url;

        // Convert mysql:// → jdbc:mysql://
        if (url.startsWith("mysql://")) {
            url = "jdbc:mysql://" + url.substring(8);
        }

        // Add required params if not present
        if (!url.contains("?")) {
            url += "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        } else if (!url.contains("allowPublicKeyRetrieval")) {
            url += "&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        }
        return url;
    }

    private String resolveUsername() {
        if (mysqlUser != null && !mysqlUser.isEmpty()) return mysqlUser;
        if (dbUsername != null && !dbUsername.isEmpty()) return dbUsername;
        return "root";
    }

    private String resolvePassword() {
        if (mysqlPassword != null && !mysqlPassword.isEmpty()) return mysqlPassword;
        if (dbPassword != null && !dbPassword.isEmpty()) return dbPassword;
        return "";
    }
}
