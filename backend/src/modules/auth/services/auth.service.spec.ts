import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { UserRole } from '@shared/constants/roles.constants';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          'jwt.secret': 'test-secret',
          'jwt.signOptions.expiresIn': '15m',
          'jwtRefresh.secret': 'test-refresh-secret',
          'jwtRefresh.expiresIn': '7d',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        nom: 'Diop',
        prenom: 'Amadou',
        email: 'test@sghi.com',
        password: 'Test@123',
        role: UserRole.DOCTOR,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(registerDto);
      mockUserRepository.save.mockResolvedValue({
        id: '123',
        ...registerDto,
      });

      const result = await service.register(registerDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerDto.email);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        nom: 'Diop',
        prenom: 'Amadou',
        email: 'existing@sghi.com',
        password: 'Test@123',
        role: UserRole.DOCTOR,
      };

      mockUserRepository.findOne.mockResolvedValue({ id: '123', email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const loginDto = {
        email: 'test@sghi.com',
        password: 'Test@123',
      };

      const mockUser = {
        id: '123',
        email: loginDto.email,
        role: UserRole.DOCTOR,
        isActive: true,
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('mock-token');
      mockUserRepository.update.mockResolvedValue({});

      const result = await service.login(loginDto, '127.0.0.1');

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(mockUser.validatePassword).toHaveBeenCalledWith(loginDto.password);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        email: 'nonexistent@sghi.com',
        password: 'Test@123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const loginDto = {
        email: 'test@sghi.com',
        password: 'Test@123',
      };

      const mockUser = {
        id: '123',
        email: loginDto.email,
        isActive: false,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@sghi.com',
        password: 'WrongPassword@123',
      };

      const mockUser = {
        id: '123',
        email: loginDto.email,
        isActive: true,
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = '123';
      mockUserRepository.update.mockResolvedValue({});

      await service.logout(userId);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        refreshToken: null,
      });
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userId = '123';
      const mockUser = {
        id: userId,
        email: 'test@sghi.com',
        role: UserRole.DOCTOR,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
