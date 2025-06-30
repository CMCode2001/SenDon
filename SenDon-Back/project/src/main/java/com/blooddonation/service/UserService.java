package com.blooddonation.service;

import com.blooddonation.dto.UserRegistrationDto;
import com.blooddonation.dto.UserResponseDto;
import com.blooddonation.entity.User;
import com.blooddonation.enums.BloodType;
import com.blooddonation.exception.EmailAlreadyExistsException;
import com.blooddonation.exception.UserNotFoundException;
import com.blooddonation.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new EmailAlreadyExistsException("Un utilisateur avec cet email existe déjà");
        }

        // Mapper DTO vers Entity
        User user = modelMapper.map(registrationDto, User.class);

        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));

        // Sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);

        // Retourner le DTO de réponse
        return modelMapper.map(savedUser, UserResponseDto.class);
    }

    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + id));
        return modelMapper.map(user, UserResponseDto.class);
    }

    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'email : " + email));
        return modelMapper.map(user, UserResponseDto.class);
    }

    public List<UserResponseDto> getUsersByBloodType(BloodType bloodType) {
        List<User> users = userRepository.findByBloodType(bloodType);
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDto.class))
                .collect(Collectors.toList());
    }

    public List<UserResponseDto> getUsersByBloodTypeAndCity(BloodType bloodType, String city) {
        List<User> users = userRepository.findByBloodTypeAndCity(bloodType, city);
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDto.class))
                .collect(Collectors.toList());
    }

    public UserResponseDto updateUser(Long id, UserRegistrationDto updateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + id));

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (!user.getEmail().equals(updateDto.getEmail()) &&
                userRepository.existsByEmail(updateDto.getEmail())) {
            throw new EmailAlreadyExistsException("Un utilisateur avec cet email existe déjà");
        }

        // Mettre à jour les champs (sans le mot de passe)
        user.setFirstName(updateDto.getFirstName());
        user.setLastName(updateDto.getLastName());
        user.setEmail(updateDto.getEmail());
        user.setPhoneNumber(updateDto.getPhoneNumber());
        user.setBirthDate(updateDto.getBirthDate());
        user.setBloodType(updateDto.getBloodType());
        user.setAddress(updateDto.getAddress());
        user.setCity(updateDto.getCity());
        user.setPostalCode(updateDto.getPostalCode());

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserResponseDto.class);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + id));
        userRepository.delete(user);
    }

    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDto.class))
                .collect(Collectors.toList());
    }
}