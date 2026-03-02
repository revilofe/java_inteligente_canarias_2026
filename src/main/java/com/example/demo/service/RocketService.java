package com.example.demo.service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.model.RangeType;
import com.example.demo.model.Rocket;

@Service
public class RocketService {
  private final Map<String, Rocket> rocketStorage = new HashMap<>();

  public Rocket createRocket(String name, String rangeValue, int capacity) {
    validateRocketData(name, rangeValue, capacity);

    RangeType range = RangeType.fromValue(rangeValue);
    Rocket rocket = new Rocket(name, range, capacity);
    rocketStorage.put(rocket.getId(), rocket);
    return rocket;
  }

  public Collection<Rocket> getAllRockets() {
    return rocketStorage.values();
  }

  public Optional<Rocket> getRocketById(String id) {
    return Optional.ofNullable(rocketStorage.get(id));
  }

  public Rocket updateRocket(String id, String name, String rangeValue, int capacity) {
    validateRocketData(name, rangeValue, capacity);

    Rocket rocket = rocketStorage.get(id);
    if (rocket == null) {
      return null;
    }

    RangeType range = RangeType.fromValue(rangeValue);
    rocket.setName(name);
    rocket.setRange(range);
    rocket.setCapacity(capacity);
    return rocket;
  }

  public boolean deleteRocket(String id) {
    return rocketStorage.remove(id) != null;
  }

  private void validateRocketData(String name, String rangeValue, int capacity) {
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("Rocket name cannot be empty");
    }

    if (capacity < 1 || capacity > 10) {
      throw new IllegalArgumentException("Rocket capacity must be between 1 and 10");
    }

    if (RangeType.fromValue(rangeValue) == null) {
      throw new IllegalArgumentException(
          "Rocket range must be one of: suborbital, orbital, moon, mars");
    }
  }
}
