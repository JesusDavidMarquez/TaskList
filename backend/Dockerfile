FROM openjdk:17-jdk-slim
WORKDIR /app
COPY build/libs/backend-0.0.1-SNAPSHOT.jar backend.jar
CMD ["java", "-jar", "backend.jar"]
EXPOSE 8080
