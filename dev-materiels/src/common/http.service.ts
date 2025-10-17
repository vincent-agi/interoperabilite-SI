import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, from } from 'rxjs';

@Injectable()
export class HttpService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
  }

  /**
   * Effectue une requête GET
   * @param url L'URL à appeler
   * @param config Configuration de la requête
   * @returns Observable contenant la réponse
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return from(this.instance.get<T>(url, config));
  }

  /**
   * Effectue une requête POST
   * @param url L'URL à appeler
   * @param data Les données à envoyer
   * @param config Configuration de la requête
   * @returns Observable contenant la réponse
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return from(this.instance.post<T>(url, data, config));
  }

  /**
   * Effectue une requête PUT
   * @param url L'URL à appeler
   * @param data Les données à envoyer
   * @param config Configuration de la requête
   * @returns Observable contenant la réponse
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return from(this.instance.put<T>(url, data, config));
  }

  /**
   * Effectue une requête DELETE
   * @param url L'URL à appeler
   * @param config Configuration de la requête
   * @returns Observable contenant la réponse
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return from(this.instance.delete<T>(url, config));
  }

  /**
   * Effectue une requête PATCH
   * @param url L'URL à appeler
   * @param data Les données à envoyer
   * @param config Configuration de la requête
   * @returns Observable contenant la réponse
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return from(this.instance.patch<T>(url, data, config));
  }

  /**
   * Définit la configuration par défaut pour les requêtes
   * @param config Configuration à appliquer
   */
  setConfig(config: AxiosRequestConfig): void {
    Object.assign(this.instance.defaults, config);
  }

  /**
   * Obtient l'instance Axios sous-jacente
   * @returns L'instance Axios
   */
  getAxiosRef(): AxiosInstance {
    return this.instance;
  }
}