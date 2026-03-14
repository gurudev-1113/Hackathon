# Orbipulse Backend

A clean Spring Boot application for valve monitoring and control system.

## Prerequisites

- Java 21 or higher
- Maven 3.6 or higher

## Quick Start

### 1. Build project
```bash
mvn clean compile
```

### 2. Run application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 3. Test API Endpoints

#### Get all valves
```bash
curl -X GET http://localhost:8080/api/valves
```

#### Create a valve
```bash
curl -X POST http://localhost:8080/api/valves \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Valve",
    "location": "Tank A",
    "status": "CLOSED",
    "currentFlow": 0.0,
    "maxFlow": 100.0,
    "pressure": 50.0
  }'
```

#### Get valve by ID
```bash
curl -X GET http://localhost:8080/api/valves/1
```

### 4. H2 Database Console

Access the H2 database console at: `http://localhost:8080/h2-console`

- **JDBC URL**: `jdbc:h2:mem:orbipulse`
- **Username**: `sa`
- **Password**: `password`

## Project Structure

```
src/main/java/com/orbipulse/
├── OrbipulseApplication.java    # Main Spring Boot application
├── controller/
│   └── ValveController.java     # REST API endpoints
├── service/
│   └── ValveService.java        # Business logic
├── repository/
│   └── ValveRepository.java     # Data access layer
└── model/
    └── Valve.java              # Entity class
```

## API Endpoints

### Valves
- `GET /api/valves` - Get all valves
- `POST /api/valves` - Create new valve
- `GET /api/valves/{id}` - Get valve by ID

## Configuration

The application uses:
- **Server Port**: 8080
- **Database**: H2 in-memory database
- **JPA**: Hibernate with auto DDL
- **Logging**: DEBUG level for application components

## Development

### Running Tests
```bash
mvn test
```

### Building JAR
```bash
mvn clean package
```

### Running JAR
```bash
java -jar target/backend-java-1.0.0.jar
```
