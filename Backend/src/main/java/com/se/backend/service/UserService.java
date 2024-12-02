package com.se.backend.service;

import com.se.backend.dto.response.MinimalUserProfile;

public interface UserService {
	MinimalUserProfile getMinimalProfile(String username);
}
