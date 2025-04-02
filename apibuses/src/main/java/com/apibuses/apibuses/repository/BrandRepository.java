package com.apibuses.apibuses.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apibuses.apibuses.models.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long>{
    
}
