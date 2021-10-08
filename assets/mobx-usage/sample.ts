import { observable, action, computed, runInAction } from 'mobx';
import User from '@/js/setup/parse/user.orm';
import * as apis from '@/js/apis';

export class AuthStore {
    @observable
    _userInfo: User | null = null;

    @computed
    get logined () {
        return !!this._userInfo;
    }

    @computed
    get userInfo () {
        return this._userInfo
    }
    @computed
    get userId () {
        if (!this._userInfo) return null;
        return this._userInfo.id;
    }
    @computed
    get userName () {
        if (!this._userInfo) return '';
        return this._userInfo.username;
    }

    @action
    getUserInfo () {
        return apis
            .loginStatus()
            .then(action((curUser: any) => {
                this._userInfo = curUser;
            }))
            .catch((error: apis.ApiHttpError) => Promise.reject(error.replaceMsgWith(apis.loginStatus.codeMsgHash)))
    }

    @action
    login (payload: any): Promise<any> {
        return apis.login(payload).then(action(
            (curUser: User) => this._userInfo = curUser
        ))
    }

    @action
    logout (): Promise<any> {
        return apis.logout().then(action(
            () => this._userInfo = null
        ))
    }
}

export default new AuthStore();
