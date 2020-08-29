import { Injectable } from '@nestjs/common';
import {APP_CONSTANTS} from "../../../shared/util/app-constants";
import axios from 'axios';
import {AppConfigService} from "../../../shared/services/app-config.service";
import {HttpMethodsEnum} from "../../../shared/models/enums/http-methods.enum";
@Injectable()
export class HealthCheckService {
    constructor(){

    }

    async checkStatus() {
        console.log('calling service');
        // here we make sure that axios works since an internet connection is needed -getAxiosProxyConfiguration
        return new Promise(async(res, rej) => {
            const axiosConfig = await AppConfigService.configureAxios(APP_CONSTANTS.HEALTH_CHECK.URL, HttpMethodsEnum.GET,
                APP_CONSTANTS.HEALTH_CHECK.PROXY);
            axios(axiosConfig).then(response => {
                console.log('data from axios:', response.data);
                // pnly when the interconnection can be made we make this call
                res('true');
            }).catch(err => {
                // else reject thisreturn Promise.reject(false);
                console.log('err data:', err);
                rej(err);
            });
        });



    }
}
