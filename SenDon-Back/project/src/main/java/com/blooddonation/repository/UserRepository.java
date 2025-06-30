package com.blooddonation.repository;

import com.blooddonation.entity.User;
import com.blooddonation.enums.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByBloodType(BloodType bloodType);
    
    @Query("SELECT u FROM User u WHERE u.bloodType = :bloodType AND u.city = :city")
    List<User> findByBloodTypeAndCity(@Param("bloodType") BloodType bloodType, @Param("city") String city);
    
    @Query("SELECT u FROM User u WHERE u.city = :city")
    List<User> findByCity(@Param("city") String city);
}