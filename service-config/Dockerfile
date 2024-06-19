FROM maven:3.8.1-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/service-config-*.jar service-config.jar
EXPOSE 8888
CMD ["java", "-jar", "-Dspring.config.location=classpath:/,file:/app/", "service-config.jar"]
 