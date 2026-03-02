# Rocket Management API Specification
- **Type**: feat
- **Status**: Draft

## Problem Description

The AstroBookings travel application needs a backend API to manage rocket inventory. Travel agents need to create, retrieve, and manage available rockets to offer customers different travel options to various destinations. Currently, there is no way to store and organize rocket data, preventing the system from offering booking services.

### User Stories

- As a travel agent, I want to **create new rockets** with specifications (name, range, capacity) so that I can add available vehicles to the booking system.
- As a travel agent, I want to **retrieve all rockets** or specific rocket details so that I can view inventory and provide customers with available options.
- As an application administrator, I want to **update and delete rockets** so that I can manage the fleet as needs change.

## Solution Overview

### User/App interface

- REST API endpoints for CRUD operations on rockets
- Standard HTTP methods: POST (create), GET (retrieve), PUT (update), DELETE (delete)
- JSON request/response format
- Base path: `/api/rockets`

### Model and logic

- Rocket entity with attributes:
  - `id`: unique identifier
  - `name`: rocket name (required, non-empty string)
  - `range`: travel range type (required, enum: "suborbital", "orbital", "moon", "mars")
  - `capacity`: passenger capacity (required, integer 1-10)
- Business validation: ensure capacity is within valid range and range type is valid
- No complex business logic required for MVP

### Persistence

- Relational database for rocket storage
- Table/collection with columns/fields matching Rocket entity
- Support for standard CRUD operations

## Acceptance Criteria

- [ ] THE [System] SHALL provide a POST endpoint at `/api/rockets` to create a new rocket with name, range, and capacity.
- [ ] WHEN a rocket is created THE [System] SHALL validate that capacity is between 1 and 10 passengers.
- [ ] WHEN a rocket is created THE [System] SHALL validate that range is one of: "suborbital", "orbital", "moon", or "mars".
- [ ] THE [System] SHALL provide a GET endpoint at `/api/rockets` to retrieve all rockets in the system.
- [ ] THE [System] SHALL provide a GET endpoint at `/api/rockets/{id}` to retrieve a specific rocket by identifier.
- [ ] WHEN invalid data is provided THE [System] SHALL return HTTP 400 with error details indicating validation failures.
- [ ] THE [System] SHALL provide a PUT endpoint at `/api/rockets/{id}` to update an existing rocket's attributes.
- [ ] THE [System] SHALL provide a DELETE endpoint at `/api/rockets/{id}` to remove a rocket from the system.
- [ ] WHEN a rocket is successfully created or modified THE [System] SHALL return HTTP 201 or 200 respectively with the rocket data in JSON format.
