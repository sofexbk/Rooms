# Stage 1: Build the application
FROM maven:3.8.1-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Create the final image
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/service-register-*.jar service-register.jar
EXPOSE 8761
CMD ["java", "-jar", "service-register.jar"]