import BaseService from 'services/BaseService';
import * as constants from 'config/constants';
import {ApiError} from 'errors';

class ErrorLogService extends BaseService {

    constructor() {
        super('errorlog');
    }
}

export default new ErrorLogService();
