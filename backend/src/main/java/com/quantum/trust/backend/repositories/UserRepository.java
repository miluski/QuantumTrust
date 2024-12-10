package com.quantum.trust.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.User;

/**
 * @repository UserRepository
 * @description Repository interface for managing User entities.
 *
 * @interface UserRepository
 *
 * @method findByEmailAddress - Finds a user by their email address.
 * @param {String} emailAddress - The email address of the user to be found.
 * @returns {User} - The user associated with the given email address.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmailAddress(String emailAddress);
}