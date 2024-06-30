FROM eclipse-temurin:21.0.3_9-jdk-alpine

WORKDIR /app

COPY ./target/backend-0.0.1-SNAPSHOT.jar /app

EXPOSE 8080

CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]