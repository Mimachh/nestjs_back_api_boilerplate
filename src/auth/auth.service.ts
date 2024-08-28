import { Injectable, Redirect } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from "uuid";
import { UserService } from 'src/user/user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { LogUserDto } from './dto/log-user.dto';


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async login({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;
    
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email
      },
    });

    if(!existingUser) {
        throw new Error('User not found');
    }

    const isPasswordValid = await this.isPasswordValid({password, hashedPassword: existingUser.password});

    if(!isPasswordValid) {
        throw new Error('Password is incorrect');
    }

    return this.authenticateUser({userId: existingUser.id});
  }

  async register({ registerBody }: { registerBody: CreateUserDto }) {
    const { email, firstName, password, role } = registerBody;
    
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email
      },
    });
    
    if(existingUser) {
        throw new Error('Un compte existe déjà à cette adresse');
    }

    if(role.includes('vendor') || role.includes('pro')) {
      return "Veuillez remplir les champs supplémentaires";
    }

    const hashPassword = await this.hashPassword({password})

    const newUser = await this.prisma.user.create({
      data: {
        email,
        firstName,
        password: hashPassword
      }
    })

    const verificationToken = await this.generateVerificationToken(email);
    // TODO
    // send email with verificationToken
    // return {verificationToken};

    
    return this.authenticateUser({userId: newUser.id});

  
  }

  async confirmEmail({token} : ConfirmEmailDto) {
    const existingToken = await this.getVerificationTokenByToken(token);

    if(!existingToken) {
      throw new Error('Invalid token');
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
      throw new Error('Token has expired');
    }

    const existingUser = await this.userService.getUserByEmail({email: existingToken.email});

    if(!existingUser) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email
      }
    });

    await this.prisma.verificationToken.delete({
      where: { id: existingToken.id }
    });

    return { message: 'Email confirmed' };
  }

  // TODO
  // resend verification email
  // user is auth
  async resendVerificationEmail({} : {}) {

  }

  async askForPasswordReset({email} : ForgotPasswordDto) {
    const existingUser = await this.userService.getUserByEmail({email});

    if(!existingUser) {
      throw new Error('User not found');
    }

    const passwordResetToken = await this.generatePasswordResetToken(email);
    // return {passwordResetToken};
    // TODO
    // send email with passwordResetToken

    return { message: 'Password reset email sent' };
  }

  // TODO
  // reset the password : changement de mdp
 


  private async generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
  
    const existingToken = await this.getPasswordResetTokenByEmail(email);
  
    if (existingToken) {
      await this.prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
      });
    }
  
    const passwordResetToken = await this.prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });
  
    return passwordResetToken;
  }

  private async getPasswordResetTokenByEmail(email: string) {
    try {
      const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
        where: { email }
      });
  
      return passwordResetToken;
    } catch {
      return null;
    }
  };

  private async generateVerificationToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
  
    const existingToken = await this.getVerificationTokenByEmail(email);
  
    if (existingToken) {
      await this.prisma.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
  
    const verficationToken = await this.prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      }
    });
  
    return verficationToken;
  };


  private async getVerificationTokenByToken(token: string){
    try {
      const verificationToken = await this.prisma.verificationToken.findUnique({
        where: { token }
      });
  
      return verificationToken;
    } catch {
      return null;
    }
  }

  private async getVerificationTokenByEmail(email: string){
    try {
      const verificationToken = await this.prisma.verificationToken.findFirst({
        where: { email }
      });
  
      return verificationToken;
    } catch {
      return null;
    }
  }

  private async hashPassword({password}: {password: string}): Promise<string> {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid({password, hashedPassword}: {password: string, hashedPassword: string}): Promise<boolean> {
    const isPasswordValid = await compare(password, hashedPassword);
    return isPasswordValid;
  }

  private authenticateUser({userId}: UserPayload){
    const payload: UserPayload = { userId };
    return {
        access_token: this.jwtService.sign(payload)
    }
  }

  
}
