# Stage 1: Build the application using Maven and Temurin Java 8
FROM maven:3.8-eclipse-temurin-8 AS build
WORKDIR /app
COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application using Temurin JRE 8
FROM eclipse-temurin:8-jre-alpine

WORKDIR /app
COPY --from=build /app/target/backend-1.0-SNAPSHOT.jar app.jar

ENV JAVA_OPTS="\
  -Xms512m \
  -Xmx1536m \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+UseCGroupMemoryLimitForHeap \
  -XX:MaxRAMFraction=2 \
  -XX:+UseG1GC \
  -XX:ParallelGCThreads=4 \
  -XX:ConcGCThreads=2 \
  -XX:+UseStringDeduplication \
  -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]