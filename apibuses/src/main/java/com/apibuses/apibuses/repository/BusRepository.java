package com.apibuses.apibuses.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apibuses.apibuses.models.Bus;

public interface BusRepository extends JpaRepository<Bus, Long> {
    
}
