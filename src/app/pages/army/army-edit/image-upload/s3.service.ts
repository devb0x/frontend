import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import {environment} from "../../../../../environments/environment";
import { Observable, from } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class S3Service {
	private s3: AWS.S3;

	constructor() {
		AWS.config.update({
			accessKeyId: environment.AWS_ACCESS_KEY_ID,
			secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
			region: environment.AWS_REGION
		});

		this.s3 = new AWS.S3();
	}

	uploadFile(file: File): Observable<AWS.S3.ManagedUpload.SendData> {
		const params = {
			Bucket: 'wharmy',
			Key: file.name,
			Body: file,
			ACL: 'public-read'
		};

		return from(this.s3.upload(params).promise());
	}
}
