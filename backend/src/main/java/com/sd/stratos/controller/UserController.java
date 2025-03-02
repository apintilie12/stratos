package com.sd.stratos.controller;


import com.sd.stratos.entity.User;
import com.sd.stratos.service.UserService;
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

    @GetMapping("/{id}")
    public User findById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User add(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        userService.deleteUser(id);
    }
}
