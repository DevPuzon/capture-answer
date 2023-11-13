import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { environment } from 'src/environments/environment';
import { createWorker, Worker } from 'tesseract.js';
import { AppStates } from '../core/app-states';
import { OcrScan } from '../models/ocr-scan.model';
import { CommonUseService } from './common-use.service';
import { CommonUseUtil } from '../core/utils/common-use.util';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  worker!: Worker;

  constructor(private httpClient:HttpClient,
              private commonUseUtil:CommonUseUtil,
              private appState:AppStates) { }

}
