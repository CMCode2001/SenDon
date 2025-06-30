package com.blooddonation.repository;

import com.blooddonation.entity.BloodRequestResponse;
import com.blooddonation.enums.ResponseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodRequestResponseRepository extends JpaRepository<BloodRequestResponse, Long> {
    
    List<BloodRequestResponse> findByBloodRequestId(Long bloodRequestId);
    
    List<BloodRequestResponse> findByDonorUserId(Long donorUserId);
    
    List<BloodRequestResponse> findByStatus(ResponseStatus status);
    
    @Query("SELECT brr FROM BloodRequestResponse brr WHERE brr.bloodRequest.id = :requestId AND brr.status = :status")
    List<BloodRequestResponse> findByBloodRequestIdAndStatus(@Param("requestId") Long requestId, 
                                                            @Param("status") ResponseStatus status);
    
    @Query("SELECT brr FROM BloodRequestResponse brr WHERE brr.donorUser.id = :donorUserId AND brr.status = :status")
    List<BloodRequestResponse> findByDonorUserIdAndStatus(@Param("donorUserId") Long donorUserId, 
                                                         @Param("status") ResponseStatus status);
    
    @Query("SELECT brr FROM BloodRequestResponse brr WHERE brr.bloodRequest.id = :requestId AND brr.donorUser.id = :donorUserId")
    Optional<BloodRequestResponse> findByBloodRequestIdAndDonorUserId(@Param("requestId") Long requestId, 
                                                                     @Param("donorUserId") Long donorUserId);
    
    @Query("SELECT brr FROM BloodRequestResponse brr WHERE brr.bloodRequest.hospitalUser.id = :hospitalUserId")
    List<BloodRequestResponse> findResponsesForHospitalUser(@Param("hospitalUserId") Long hospitalUserId);
}