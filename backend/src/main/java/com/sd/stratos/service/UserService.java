package com.sd.stratos.service;

import com.sd.stratos.dto.UserCreateDTO;
import com.sd.stratos.dto.UserUpdateDTO;
import com.sd.stratos.entity.User;
import com.sd.stratos.entity.UserRole;
import com.sd.stratos.exception.UsernameAlreadyExistsException;
import com.sd.stratos.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User addUser(UserCreateDTO userCreateDTO) {
        User user = new User();
        user.setUsername(userCreateDTO.username());
        user.setPassword(userCreateDTO.password());
        user.setRole(userCreateDTO.role());
        validateUser(user);
        return userRepository.save(user);
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUser(UUID id, UserUpdateDTO userUpdateDTO) {
        Optional<User> existingUser = userRepository.findById(id);
        if(existingUser.isPresent()) {
            User updatedUser = existingUser.get();
            updatedUser.setUsername(userUpdateDTO.username());
            updatedUser.setPassword(userUpdateDTO.password());
            updatedUser.setRole(userUpdateDTO.role());
            return userRepository.save(updatedUser);
         }
        throw new IllegalStateException("User not found");
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public List<UserRole> getAllUserRoles() {
        return List.of(UserRole.values());
    }

    public void validateUser(User user) {
        if(userRepository.findByUsername(user.getUsername()) != null) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }
    }
}
