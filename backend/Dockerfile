# Stage 1: Build the application using Maven and Temurin Java 8
FROM maven:3.8-eclipse-temurin-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application using Temurin JRE 8
FROM eclipse-temurin:8-jre
WORKDIR /app
# Matches your artifactId and version in pom.xml
COPY --from=build /app/target/backend-1.0-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]