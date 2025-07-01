package com.blooddonation.service;

import com.blooddonation.dto.BloodRequestDto;
import com.blooddonation.dto.BloodRequestResponseDto;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.entity.User;
import com.blooddonation.enums.BloodType;
import com.blooddonation.enums.RequestStatus;
import com.blooddonation.enums.UrgencyLevel;
import com.blooddonation.enums.UserRole;
import com.blooddonation.exception.BloodRequestNotFoundException;
import com.blooddonation.exception.UnauthorizedAccessException;
import com.blooddonation.exception.UserNotFoundException;
import com.blooddonation.mapper.BloodRequestMapper;
import com.blooddonation.repository.BloodRequestRepository;
import com.blooddonation.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BloodRequestService {
    
    private static final Logger logger = LoggerFactory.getLogger(BloodRequestService.class);
    
    @Autowired
    private BloodRequestRepository bloodRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BloodRequestMapper bloodRequestMapper;
    
    public BloodRequestResponseDto createBloodRequest(Long hospitalUserId, BloodRequestDto requestDto) {
        try {
            logger.debug("Création d'une demande de sang pour l'utilisateur hôpital: {}", hospitalUserId);
            
            User hospitalUser = userRepository.findById(hospitalUserId)
                    .orElseThrow(() -> new UserNotFoundException("Utilisateur hôpital non trouvé avec l'ID : " + hospitalUserId));
            
            // Vérifier que l'utilisateur a le rôle HOSPITAL
            if (hospitalUser.getRole() != UserRole.HOSPITAL) {
                throw new UnauthorizedAccessException("Seuls les utilisateurs hôpitaux peuvent créer des demandes de sang");
            }
            
            BloodRequest request = bloodRequestMapper.toEntity(requestDto, hospitalUser);
            BloodRequest savedRequest = bloodRequestRepository.save(request);
            
            logger.debug("Demande de sang créée avec l'ID: {}", savedRequest.getId());
            return bloodRequestMapper.toResponseDto(savedRequest);
            
        } catch (UserNotFoundException | UnauthorizedAccessException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la création de la demande de sang pour l'utilisateur: {}", hospitalUserId, e);
            throw new RuntimeException("Erreur lors de la création de la demande: " + e.getMessage(), e);
        }
    }
    
    public List<BloodRequestResponseDto> getBloodRequestsByHospitalUser(Long hospitalUserId) {
        try {
            if (!userRepository.existsById(hospitalUserId)) {
                throw new UserNotFoundException("Utilisateur hôpital non trouvé avec l'ID : " + hospitalUserId);
            }
            
            List<BloodRequest> requests = bloodRequestRepository.findByHospitalUserId(hospitalUserId);
            return requests.stream()
                    .map(bloodRequestMapper::toResponseDto)
                    .collect(Collectors.toList());
                    
        } catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des demandes pour l'hôpital: {}", hospitalUserId, e);
            throw new RuntimeException("Erreur lors de la récupération des demandes: " + e.getMessage(), e);
        }
    }
    
    public List<BloodRequestResponseDto> getActiveBloodRequestsByHospitalUser(Long hospitalUserId) {
        try {
            if (!userRepository.existsById(hospitalUserId)) {
                throw new UserNotFoundException("Utilisateur hôpital non trouvé avec l'ID : " + hospitalUserId);
            }
            
            List<BloodRequest> requests = bloodRequestRepository.findByHospitalUserIdAndStatus(hospitalUserId, RequestStatus.ACTIVE);
            return requests.stream()
                    .map(bloodRequestMapper::toResponseDto)
                    .collect(Collectors.toList());
                    
        } catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des demandes actives pour l'hôpital: {}", hospitalUserId, e);
            throw new RuntimeException("Erreur lors de la récupération des demandes: " + e.getMessage(), e);
        }
    }
    
    public BloodRequestResponseDto getBloodRequestById(Long requestId) {
        try {
            BloodRequest request = bloodRequestRepository.findById(requestId)
                    .orElseThrow(() -> new BloodRequestNotFoundException("Demande de sang non trouvée avec l'ID : " + requestId));
            return bloodRequestMapper.toResponseDto(request);
            
        } catch (BloodRequestNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de la demande: {}", requestId, e);
            throw new RuntimeException("Erreur lors de la récupération de la demande: " + e.getMessage(), e);
        }
    }
    
    public BloodRequestResponseDto updateBloodRequest(Long requestId, BloodRequestDto requestDto, Long hospitalUserId) {
        try {
            BloodRequest request = bloodRequestRepository.findById(requestId)
                    .orElseThrow(() -> new BloodRequestNotFoundException("Demande de sang non trouvée avec l'ID : " + requestId));
            
            // Vérifier que l'utilisateur est propriétaire de la demande
            if (!request.getHospitalUser().getId().equals(hospitalUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à modifier cette demande");
            }
            
            // Ne permettre la modification que si la demande est active
            if (request.getStatus() != RequestStatus.ACTIVE) {
                throw new IllegalStateException("Seules les demandes actives peuvent être modifiées");
            }
            
            bloodRequestMapper.updateEntityFromDto(request, requestDto);
            BloodRequest updatedRequest = bloodRequestRepository.save(request);
            
            return bloodRequestMapper.toResponseDto(updatedRequest);
            
        } catch (BloodRequestNotFoundException | UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour de la demande: {}", requestId, e);
            throw new RuntimeException("Erreur lors de la mise à jour de la demande: " + e.getMessage(), e);
        }
    }
    
    public void cancelBloodRequest(Long requestId, Long hospitalUserId) {
        try {
            BloodRequest request = bloodRequestRepository.findById(requestId)
                    .orElseThrow(() -> new BloodRequestNotFoundException("Demande de sang non trouvée avec l'ID : " + requestId));
            
            // Vérifier que l'utilisateur est propriétaire de la demande
            if (!request.getHospitalUser().getId().equals(hospitalUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à annuler cette demande");
            }
            
            // Ne permettre l'annulation que si la demande est active
            if (request.getStatus() != RequestStatus.ACTIVE) {
                throw new IllegalStateException("Seules les demandes actives peuvent être annulées");
            }
            
            request.setStatus(RequestStatus.CANCELLED);
            bloodRequestRepository.save(request);
            
        } catch (BloodRequestNotFoundException | UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de l'annulation de la demande: {}", requestId, e);
            throw new RuntimeException("Erreur lors de l'annulation de la demande: " + e.getMessage(), e);
        }
    }
    
    public void completeBloodRequest(Long requestId, Long hospitalUserId) {
        try {
            BloodRequest request = bloodRequestRepository.findById(requestId)
                    .orElseThrow(() -> new BloodRequestNotFoundException("Demande de sang non trouvée avec l'ID : " + requestId));
            
            // Vérifier que l'utilisateur est propriétaire de la demande
            if (!request.getHospitalUser().getId().equals(hospitalUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à marquer cette demande comme complétée");
            }
            
            // Ne permettre la complétion que si la demande est active
            if (request.getStatus() != RequestStatus.ACTIVE) {
                throw new IllegalStateException("Seules les demandes actives peuvent être marquées comme complétées");
            }
            
            request.setStatus(RequestStatus.COMPLETED);
            bloodRequestRepository.save(request);
            
        } catch (BloodRequestNotFoundException | UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la complétion de la demande: {}", requestId, e);
            throw new RuntimeException("Erreur lors de la complétion de la demande: " + e.getMessage(), e);
        }
    }

    public List<BloodRequestResponseDto> getAllBloodRequests() {
        try {
            List<BloodRequest> requests = bloodRequestRepository.findAll();
            return requests.stream()
                    .map(bloodRequestMapper::toResponseDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de toutes les demandes de sang", e);
            throw new RuntimeException("Erreur lors de la récupération de toutes les demandes de sang: " + e.getMessage(), e);
        }
    }
    
    
    // Méthodes pour les donneurs
    public List<BloodRequestResponseDto> getAllActiveBloodRequests() {
        List<BloodRequest> requests = bloodRequestRepository.findAllActiveRequestsOrderedByUrgency();
        return requests.stream()
                .map(bloodRequestMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<BloodRequestResponseDto> getNearbyBloodRequests(BigDecimal userLatitude, BigDecimal userLongitude, BloodType bloodType) {
        List<BloodRequest> requests = bloodRequestRepository.findNearbyActiveRequests(userLatitude, userLongitude, bloodType.name());
        return requests.stream()
                .map(bloodRequestMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<BloodRequestResponseDto> getBloodRequestsByBloodType(BloodType bloodType) {
        List<BloodRequest> requests = bloodRequestRepository.findByBloodTypeAndStatus(bloodType, RequestStatus.ACTIVE);
        return requests.stream()
                .map(bloodRequestMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<BloodRequestResponseDto> getBloodRequestsByUrgencyLevel(UrgencyLevel urgencyLevel) {
        List<BloodRequest> requests = bloodRequestRepository.findByUrgencyLevel(urgencyLevel);
        return requests.stream()
                .filter(r -> r.getStatus() == RequestStatus.ACTIVE)
                .map(bloodRequestMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    // Méthode pour marquer les demandes expirées
    @Transactional
    public void markExpiredRequests() {
        List<BloodRequest> expiredRequests = bloodRequestRepository.findExpiredRequests(LocalDateTime.now());
        for (BloodRequest request : expiredRequests) {
            request.setStatus(RequestStatus.EXPIRED);
        }
        bloodRequestRepository.saveAll(expiredRequests);
        logger.info("Marqué {} demandes comme expirées", expiredRequests.size());
    }
}