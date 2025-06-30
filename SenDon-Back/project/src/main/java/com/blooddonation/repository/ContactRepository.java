package com.blooddonation.repository;

import com.blooddonation.entity.Contact;
import com.blooddonation.entity.User;
import com.blooddonation.enums.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    List<Contact> findByUser(User user);
    
    List<Contact> findByUserId(Long userId);
    
    @Query("SELECT c FROM Contact c WHERE c.user = :user AND c.bloodType = :bloodType")
    List<Contact> findByUserAndBloodType(@Param("user") User user, @Param("bloodType") BloodType bloodType);
    
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId AND c.bloodType = :bloodType")
    List<Contact> findByUserIdAndBloodType(@Param("userId") Long userId, @Param("bloodType") BloodType bloodType);
    
    @Query("SELECT c FROM Contact c WHERE c.user = :user AND c.bloodType = c.user.bloodType")
    List<Contact> findContactsWithSameBloodTypeAsUser(@Param("user") User user);
    
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId AND c.bloodType = (SELECT u.bloodType FROM User u WHERE u.id = :userId)")
    List<Contact> findContactsWithSameBloodTypeAsUserById(@Param("userId") Long userId);
}