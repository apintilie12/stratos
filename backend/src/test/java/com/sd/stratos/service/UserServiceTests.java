package com.sd.stratos.service;

import com.sd.stratos.dto.UserCreateDTO;
import com.sd.stratos.dto.UserUpdateDTO;
import com.sd.stratos.entity.User;
import com.sd.stratos.entity.UserRole;
import com.sd.stratos.exception.UsernameAlreadyExistsException;
import com.sd.stratos.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetAllUsers() {
        ///Given:
        List<User> users = List.of(new User(), new User());

        ///When:
        when(userRepository.findAll()).thenReturn(users);
        List<User> result = userService.getAllUsers(, , , );

        ///Then:
        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
        assertEquals(users, result);
    }

    @Test
    void testAddUser() {
        /// Given:
        UserCreateDTO userCreateDTO = new UserCreateDTO("username", "password", UserRole.ADMIN);
        User userToAdd = new User();
        userToAdd.setUsername("username");
        userToAdd.setPassword("password");
        userToAdd.setRole(UserRole.ADMIN);

        User savedUser = new User();
        savedUser.setUsername("username");
        savedUser.setPassword("password");
        savedUser.setRole(UserRole.ADMIN);
        savedUser.setId(UUID.randomUUID());

        /// When:
        when(userRepository.save(userToAdd)).thenReturn(savedUser);
        User result = userService.addUser(userCreateDTO);

        /// Then:
        assertEquals(result, savedUser);
        assertNotNull(result.getId());
        verify(userRepository, times(1)).save(any());
    }

    @Test
    void testUpdateUser() {
        /// Given:
        UUID userId = UUID.randomUUID();
        UserUpdateDTO oldUserDTO = new UserUpdateDTO(userId, "oldPassword", "newPassword", UserRole.PILOT);

        User oldUser = new User(userId, "oldPassword", "newPassword", UserRole.PILOT);

        User updatedUser = new User();
        updatedUser.setId(userId);
        updatedUser.setUsername("newUsername");
        updatedUser.setPassword("newPassword");
        updatedUser.setRole(UserRole.ADMIN);

        /// When:
        when(userRepository.findById(userId)).thenReturn(Optional.of(oldUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        User result = userService.updateUser(userId, oldUserDTO);

        /// Then:
        assertEquals(updatedUser, result);
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateUserNotFound() {
        /// Given:
        UUID userId = UUID.randomUUID();
        UserUpdateDTO user = new UserUpdateDTO(UUID.randomUUID(), "","",UserRole.PILOT);

        /// When:
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        /// Then:
        assertThrows(IllegalStateException.class, () -> userService.updateUser(userId, user ));
    }

    @Test
    void testDeleteUser() {
        /// Given:
        UUID userId = UUID.randomUUID();

        /// When:
        doNothing().when(userRepository).deleteById(userId);
        userService.deleteUser(userId);

        /// Then:
        verify(userRepository, times(1)).deleteById(userId);

    }

    @Test
    void testUsernameAlreadyExists() {
        /// Given:
        UserCreateDTO userCreateDTO = new UserCreateDTO("existingUsername", "password", UserRole.ADMIN);
        User existingUser = new User();
        existingUser.setId(UUID.randomUUID());
        existingUser.setUsername("existingUsername");
        existingUser.setPassword("password");
        existingUser.setRole(UserRole.ADMIN);

        /// When:
        when(userRepository.findByUsername("existingUsername")).thenReturn(existingUser);

        /// Then:
        assertThrows(UsernameAlreadyExistsException.class, () -> userService.addUser(userCreateDTO));
        verify(userRepository, times(1)).findByUsername("existingUsername");
        verify(userRepository, never()).save(any(User.class));
    }
}
