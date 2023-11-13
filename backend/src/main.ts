import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin'; 
import { ServiceAccount } from "firebase-admin";
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: true }); 
  const firebase = {
    "type": "service_account",
    "project_id": "ocr-chat-ai",
    "private_key_id": "0995fd5851f1aa7122568666b36db0105df6ded0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2AIX6h/yWQVfv\nwL42gDPxuzEqRxRgO9tLysDWOuQD57stRoRsQxhw+syqudVbZNxWTehcrIGkpEDC\niAvvyUQf/W0n9x0vREcYIAREn8Pola/62/1J8c80aLA5LH9hc+EJETxj7C0zU92G\nWijCSlbAbfnG7LLIe7FLk2OhEiQekGndIQvdK/x2w8+2UdX1vUQgMuF4P9WcKpxQ\nBOpA2AMkiY7HHxHleVHmdXUikhMZUMPPjN52Nfo7y/sD17Eubb0rRP9SjYznBGHj\nqrri4iSsyQvkCIRiDZHVf4hCC9pdYGxzQ8aj/X+4sxR3N8ZlKm+/HPr9PTnND1/2\ni6vSEGJ7AgMBAAECggEATAAl8ntsz7XTqct74rhgeJYprrTl3lXAeoLdSdhntPXE\npOBolejiwPMKGlTlsneIxwVbfa+Pp5frbxBuo6ARMaabOXAooL9LTNi5z4pDvdEc\nHo5U09cFJqZ8yDM7sg84rpei9zr9mQxxWhQ2JwPx/AMwpY/cDHoSjDOtC+rOaHBB\nh31gwCxLcOD5NYUl1KzvOBuBk+K70pIdvDhoaBCAL40vOyvs2tn1zjGWlFOnl1tb\n07QGmIbZ3u10orNJ7rP1UpVEVH8nrq6g2glQgnAsm+EPZRo0I60fuClD/eMLi8vO\n8Mp8jrLJ89+O7bxiHxvmX2i/ZahoVwihbC2Lo+RcMQKBgQD5keHlu3E6ibG0IFee\nWuMuw+FJmXVriv/qjQkT2XOM4W7CXOex2DMJ+lBRNLipQt+mips2BMm3sDSV35LN\naFFpcgyGMYo2pr2vzX6tS270GzFF8XHhEY0hRpG5Bu75earoeSI/FijfSeLXa4HB\n0MFefQt/JHaz9VSUz0sbPbr2KQKBgQC6sPnUwztMi9jnuux2iuB7l/4Zc8FoqTs6\n39Jh8oeVy4si/sopwusurHUE5GiXcwPfavrlswx3xgP3LheD64w2xrHWSnxQl94B\nnsphIMsQWhZc4zkXpWPLAxTyU7IV2u5uBFBYPPMkzyYfV846bZIvPsPdBAqE/MEf\nR1QZKtOAAwKBgEGc9vT9GMG5Hb0rm52Ia54J5ZsB+3rwqmOx/Kb5ToXFZuc2obuC\nCbkf1CnlYH8vk7knS7MiAx6F9u1IQEI8oNrGH0DQmXPQ1qH3tsw8vsjytTucRMJV\naPNMqFcq2X1BXYuM/VH0s34w4LCeFRktlwkOew1MOuEJKNmOvkJFMngxAoGAKNrt\n8XfAFGJOV3f6o36E3cdHXj6MxuCyC5JLsg+nSErA6imkCDuVyCMJgMaTdQFAibYZ\nrgbe5Z854u/9SWtUxe/5nxGx3tk9RlF/rH3Gso9kcXNwXRJeomDMRrO2Nz4wC3d6\nNbUw6I9EontOsE6mPRyZNFbcDnpZsQSlDNTocA0CgYEA12+NKMxm9ZFCb5iR6XBZ\nXItrwUDM5Du6l6Iy/nGDFt3rLPjR4YQZ28Jvup/lfbA9S+B8rXJtdqi60Ky6JmkX\nrrs38rbHfGVSsw6zecZOVpqS2EhUgNYk3hpm+XD0ZWS8yaZhGL7L+EXsIPveYXaF\n5FsDHnS/S8WnnCO040dk0dE=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-avn2g@ocr-chat-ai.iam.gserviceaccount.com",
    "client_id": "117062969956451575801",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-avn2g%40ocr-chat-ai.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}
  
  const adminConfig: ServiceAccount = {
    "projectId": firebase.project_id,
    "privateKey": firebase.private_key,
    "clientEmail": firebase.client_email,
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: "https://ocr-chat-ai.firebaseio.com",
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();