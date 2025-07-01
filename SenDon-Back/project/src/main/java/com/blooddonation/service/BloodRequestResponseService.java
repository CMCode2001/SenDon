package com.blooddonation.service;

import com.blooddonation.dto.BloodRequestResponseResponseDto;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.entity.BloodRequestResponse;
import com.blooddonation.entity.User;
import com.blooddonation.enums.RequestStatus;
import com.blooddonation.enums.ResponseStatus;
import com.blooddonation.enums.UserRole;
import com.blooddonation.exception.BloodRequestNotFoundException;
import com.blooddonation.exception.UnauthorizedAccessException;
import com.blooddonation.exception.UserNotFoundException;
import com.blooddonation.mapper.BloodRequestResponseMapper;
import com.blooddonation.repository.BloodRequestRepository;
import com.blooddonation.repository.BloodRequestResponseRepository;
import com.blooddonation.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BloodRequestResponseService {
    
    private static final Logger logger = LoggerFactory.getLogger(BloodRequestResponseService.class);
    
    @Autowired
    private BloodRequestResponseRepository responseRepository;
    
    @Autowired
    private BloodRequestRepository bloodRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BloodRequestResponseMapper responseMapper;
    
    // Méthodes pour les donneurs
    public BloodRequestResponseResponseDto respondToBloodRequest(Long requestId, Long donorUserId, BloodRequestResponseResponseDto responseDto) {
        try {
            logger.debug("Réponse à la demande {} par le donneur {}", requestId, donorUserId);
            
            BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                    .orElseThrow(() -> new BloodRequestNotFoundException("Demande de sang non trouvée avec l'ID : " + requestId));
            
            User donorUser = userRepository.findById(donorUserId)
                    .orElseThrow(() -> new UserNotFoundException("Donneur non trouvé avec l'ID : " + donorUserId));
            
            // Vérifier que l'utilisateur est un donneur (USER)
            if (donorUser.getRole() != UserRole.USER) {
                throw new UnauthorizedAccessException("Seuls les donneurs peuvent répondre aux demandes");
            }
            
            // Vérifier que la demande est active
            if (bloodRequest.getStatus() != RequestStatus.ACTIVE) {
                throw new IllegalStateException("Cette demande n'est plus active");
            }
            
            // Vérifier que le donneur n'a pas déjà répondu
            Optional<BloodRequestResponse> existingResponse = responseRepository
                    .findByBloodRequestIdAndDonorUserId(requestId, donorUserId);
            if (existingResponse.isPresent()) {
                throw new IllegalStateException("Vous avez déjà répondu à cette demande");
            }
            
            // Vérifier la compatibilité du groupe sanguin
            if (!isBloodTypeCompatible(donorUser.getBloodType(), bloodRequest.getBloodType())) {
                throw new IllegalStateException("Votre groupe sanguin n'est pas compatible avec cette demande");
            }
            
            BloodRequestResponse response = responseMapper.toEntity(responseDto, bloodRequest, donorUser);
            BloodRequestResponse savedResponse = responseRepository.save(response);
            
            logger.debug("Réponse créée avec l'ID: {}", savedResponse.getId());
            return responseMapper.toResponseDto(savedResponse);
            
        } catch (BloodRequestNotFoundException | UserNotFoundException | UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la réponse à la demande {} par le donneur {}", requestId, donorUserId, e);
            throw new RuntimeException("Erreur lors de la réponse à la demande: " + e.getMessage(), e);
        }
    }
    
    public List<BloodRequestResponseResponseDto> getDonorResponses(Long donorUserId) {
        try {
            if (!userRepository.existsById(donorUserId)) {
                throw new UserNotFoundException("Donneur non trouvé avec l'ID : " + donorUserId);
            }
            
            List<BloodRequestResponse> responses = responseRepository.findByDonorUserId(donorUserId);
            return responses.stream()
                    .map(responseMapper::toResponseDto)
                    .collect(Collectors.toList());
                    
        } catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des réponses du donneur: {}", donorUserId, e);
            throw new RuntimeException("Erreur lors de la récupération des réponses: " + e.getMessage(), e);
        }
    }
    
    public void cancelDonorResponse(Long responseId, Long donorUserId) {
        try {
            BloodRequestResponse response = responseRepository.findById(responseId)
                    .orElseThrow(() -> new RuntimeException("Réponse non trouvée avec l'ID : " + responseId));
            
            // Vérifier que l'utilisateur est propriétaire de la réponse
            if (!response.getDonorUser().getId().equals(donorUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à annuler cette réponse");
            }
            
            // Ne permettre l'annulation que si la réponse est en attente
            if (response.getStatus() != ResponseStatus.PENDING) {
                throw new IllegalStateException("Seules les réponses en attente peuvent être annulées");
            }
            
            responseRepository.delete(response);
            
        } catch (UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de l'annulation de la réponse: {}", responseId, e);
            throw new RuntimeException("Erreur lors de l'annulation de la réponse: " + e.getMessage(), e);
        }
    }
    
    // Méthodes pour les hôpitaux
    public List<BloodRequestResponseResponseDto> getResponsesForBloodRequest(Long requestId, Long hospitalUserId) {
        try {
            BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                    .orElseThrow(() -> new BloodRequestNotFoundException("Demande de sang non trouvée avec l'ID : " + requestId));
            
            // Vérifier que l'utilisateur est propriétaire de la demande
            if (!bloodRequest.getHospitalUser().getId().equals(hospitalUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à voir les réponses de cette demande");
            }
            
            List<BloodRequestResponse> responses = responseRepository.findByBloodRequestId(requestId);
            return responses.stream()
                    .map(responseMapper::toResponseDto)
                    .collect(Collectors.toList());
                    
        } catch (BloodRequestNotFoundException | UnauthorizedAccessException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des réponses pour la demande: {}", requestId, e);
            throw new RuntimeException("Erreur lors de la récupération des réponses: " + e.getMessage(), e);
        }
    }
    
    public void acceptDonorResponse(Long responseId, Long hospitalUserId) {
        try {
            BloodRequestResponse response = responseRepository.findById(responseId)
                    .orElseThrow(() -> new RuntimeException("Réponse non trouvée avec l'ID : " + responseId));
            
            // Vérifier que l'utilisateur est propriétaire de la demande
            if (!response.getBloodRequest().getHospitalUser().getId().equals(hospitalUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à accepter cette réponse");
            }
            
            // Ne permettre l'acceptation que si la réponse est en attente
            if (response.getStatus() != ResponseStatus.PENDING) {
                throw new IllegalStateException("Seules les réponses en attente peuvent être acceptées");
            }
            
            response.setStatus(ResponseStatus.ACCEPTED);
            response.setResponseDate(LocalDateTime.now());
            responseRepository.save(response);
            
        } catch (UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de l'acceptation de la réponse: {}", responseId, e);
            throw new RuntimeException("Erreur lors de l'acceptation de la réponse: " + e.getMessage(), e);
        }
    }
    
    public void declineDonorResponse(Long responseId, Long hospitalUserId) {
        try {
            BloodRequestResponse response = responseRepository.findById(responseId)
                    .orElseThrow(() -> new RuntimeException("Réponse non trouvée avec l'ID : " + responseId));
            
            // Vérifier que l'utilisateur est propriétaire de la demande
            if (!response.getBloodRequest().getHospitalUser().getId().equals(hospitalUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à refuser cette réponse");
            }
            
            // Ne permettre le refus que si la réponse est en attente
            if (response.getStatus() != ResponseStatus.PENDING) {
                throw new IllegalStateException("Seules les réponses en attente peuvent être refusées");
            }
            
            response.setStatus(ResponseStatus.DECLINED);
            response.setResponseDate(LocalDateTime.now());
            responseRepository.save(response);
            
        } catch (UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors du refus de la réponse: {}", responseId, e);
            throw new RuntimeException("Erreur lors du refus de la réponse: " + e.getMessage(), e);
        }
    }
    
    public void completeDonorResponse(Long responseId, Long hospitalUserId) {
        try {
            BloodRequestResponse response = responseRepository.findById(responseId)
                    .orElseThrow(() -> new RuntimeException("Réponse non trouvée avec l'ID : " + responseId));
            
            // Vérifier que l'utilisateur est propriétaire de la demande
            if (!response.getBloodRequest().getHospitalUser().getId().equals(hospitalUserId)) {
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à marquer cette réponse comme complétée");
            }
            
            // Ne permettre la complétion que si la réponse est acceptée
            if (response.getStatus() != ResponseStatus.ACCEPTED) {
                throw new IllegalStateException("Seules les réponses acceptées peuvent être marquées comme complétées");
            }
            
            response.setStatus(ResponseStatus.COMPLETED);
            responseRepository.save(response);
            
        } catch (UnauthorizedAccessException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la complétion de la réponse: {}", responseId, e);
            throw new RuntimeException("Erreur lors de la complétion de la réponse: " + e.getMessage(), e);
        }
    }
    
    // Méthode utilitaire pour vérifier la compatibilité des groupes sanguins
    private boolean isBloodTypeCompatible(com.blooddonation.enums.BloodType donorType, com.blooddonation.enums.BloodType requestedType) {
        // Logique de compatibilité des groupes sanguins
        switch (requestedType) {
            case O_NEGATIVE:
                return donorType == com.blooddonation.enums.BloodType.O_NEGATIVE;
            case O_POSITIVE:
                return donorType == com.blooddonation.enums.BloodType.O_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.O_POSITIVE;
            case A_NEGATIVE:
                return donorType == com.blooddonation.enums.BloodType.O_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.A_NEGATIVE;
            case A_POSITIVE:
                return donorType == com.blooddonation.enums.BloodType.O_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.O_POSITIVE ||
                       donorType == com.blooddonation.enums.BloodType.A_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.A_POSITIVE;
            case B_NEGATIVE:
                return donorType == com.blooddonation.enums.BloodType.O_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.B_NEGATIVE;
            case B_POSITIVE:
                return donorType == com.blooddonation.enums.BloodType.O_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.O_POSITIVE ||
                       donorType == com.blooddonation.enums.BloodType.B_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.B_POSITIVE;
            case AB_NEGATIVE:
                return donorType == com.blooddonation.enums.BloodType.O_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.A_NEGATIVE ||
                       donorType == com.blooddonation.enums.BloodType.B_NEGATIVE || 
                       donorType == com.blooddonation.enums.BloodType.AB_NEGATIVE;
            case AB_POSITIVE:
                return true; // AB+ peut recevoir de tous les groupes
            default:
                return false;
        }
    }
}