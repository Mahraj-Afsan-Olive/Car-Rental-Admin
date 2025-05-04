import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports like 587
        auth: {
          user: 'your-gmail-account',        //  email
          pass: 'Your-Gmail-App-Password',       // gmail app password
        },
      },
      defaults: {
        from: '"Car Rental Admin" <your-gmail-account>', 
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
