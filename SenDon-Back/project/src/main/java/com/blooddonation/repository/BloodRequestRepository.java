package com.blooddonation.repository;

import com.blooddonation.entity.BloodRequest;
import com.blooddonation.enums.BloodType;
import com.blooddonation.enums.RequestStatus;
import com.blooddonation.enums.UrgencyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    
    List<BloodRequest> findByHospitalUserId(Long hospitalUserId);
    
    List<BloodRequest> findByStatus(RequestStatus status);
    
    List<BloodRequest> findByBloodType(BloodType bloodType);
    
    List<BloodRequest> findByUrgencyLevel(UrgencyLevel urgencyLevel);
    
    @Query("SELECT br FROM BloodRequest br WHERE br.hospitalUser.id = :hospitalUserId AND br.status = :status")
    List<BloodRequest> findByHospitalUserIdAndStatus(@Param("hospitalUserId") Long hospitalUserId, 
                                                     @Param("status") RequestStatus status);
    
    @Query("SELECT br FROM BloodRequest br WHERE br.bloodType = :bloodType AND br.status = :status")
    List<BloodRequest> findByBloodTypeAndStatus(@Param("bloodType") BloodType bloodType, 
                                               @Param("status") RequestStatus status);
    
    @Query("SELECT br FROM BloodRequest br WHERE br.deadline < :currentTime AND br.status = 'ACTIVE'")
    List<BloodRequest> findExpiredRequests(@Param("currentTime") LocalDateTime currentTime);
    
    // Recherche géographique avec formule de distance Haversine
    @Query(value = """
        SELECT * FROM blood_requests br 
        WHERE br.status = 'ACTIVE' 
        AND br.blood_type = :bloodType
        AND (
            6371 * acos(
                cos(radians(:userLat)) * cos(radians(br.latitude)) * 
                cos(radians(br.longitude) - radians(:userLon)) + 
                sin(radians(:userLat)) * sin(radians(br.latitude))
            )
        ) <= br.search_radius_km
        ORDER BY br.urgency_level DESC, br.created_at ASC
        """, nativeQuery = true)
    List<BloodRequest> findNearbyActiveRequests(@Param("userLat") BigDecimal userLatitude,
                                               @Param("userLon") BigDecimal userLongitude,
                                               @Param("bloodType") String bloodType);
    
    @Query("SELECT br FROM BloodRequest br WHERE br.status = 'ACTIVE' ORDER BY br.urgencyLevel DESC, br.createdAt ASC")
    List<BloodRequest> findAllActiveRequestsOrderedByUrgency();
    
    @Query("SELECT COUNT(brr) FROM BloodRequestResponse brr WHERE brr.bloodRequest.id = :requestId")
    Long countResponsesByRequestId(@Param("requestId") Long requestId);
    
    @Query("SELECT COUNT(brr) FROM BloodRequestResponse brr WHERE brr.bloodRequest.id = :requestId AND brr.status = :status")
    Long countResponsesByRequestIdAndStatus(@Param("requestId") Long requestId, 
                                           @Param("status") String status);
}