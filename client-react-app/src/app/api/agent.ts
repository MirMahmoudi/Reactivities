import axios, { AxiosError, AxiosResponse } from 'axios';
// import { history }  from '../..';
import { toast } from 'react-toastify';
import { Activity } from '../models/activity';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    await sleep(100);
    return response;
}, (error: AxiosError) => {
    const { status, data, config } = error.response as any;
    switch (status) {
        case 400:
            if(typeof(data) === 'string'){
                toast.error(data);
                break;
            };
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                toast.error('The id of activity is not valid');
                break;
            };
            if(data.errors){
                const modalStateErrors = [];
                for(const key in data.errors){
                    if(data.errors[key])
                        modalStateErrors.push(data.errors[key]);
                };
                toast.error('Validation Error');
                throw modalStateErrors.flat();
            };
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            toast.error('not found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            toast.error('Server Error')
            break;
    }
    return Promise.reject(error);
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const request = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
    getDataList: () => request.get<Activity[]>('/activities'),
    getDetails: (id: string) => request.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => request.post<void>('/activities', activity),
    update: (activity: Activity) => request.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.delete<void>(`/activities/${id}`)
};

const agent = {
    Activities
};

export default agent;