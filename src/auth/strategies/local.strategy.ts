import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local'
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private authservice: AuthService){
    super();  
  }
validate(username: string, password:string){
    const user=this.authservice.validateUser({username,password})
    console.log('Inside LocalStrategy');
    if(!user) throw new UnauthorizedException();
    return user;
}
}