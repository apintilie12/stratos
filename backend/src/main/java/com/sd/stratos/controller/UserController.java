package com.sd.stratos.controller;


import com.sd.stratos.dto.UserCreateDTO;
import com.sd.stratos.dto.UserUpdateDTO;
import com.sd.stratos.entity.User;
import com.sd.stratos.entity.UserRole;
import com.sd.stratos.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> findAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/roles")
    public List<UserRole> findAllRoles() {
        return userService.getAllUserRoles();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User add(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        return userService.addUser(userCreateDTO);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        return userService.updateUser(id, userUpdateDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        userService.deleteUser(id);
    }
}
