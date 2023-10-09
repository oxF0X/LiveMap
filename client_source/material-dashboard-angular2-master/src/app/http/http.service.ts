import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, switchMap, map, catchError} from 'rxjs';
import {MapEvent} from '../data/maps.types';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private apiBasePath: string = '';

    constructor(private _httpClient: HttpClient) {
    }

    getMapEvents(): Observable<MapEvent[]> {
        return this._httpClient.get<any[]>(this.apiBasePath + 'map/events');
    }

    //
    // answerQuestion(userTestId: Id, questionId: Id, answers: Id[] | string[] | boolean[]): Observable<any> {
    //     const body = {
    //         userTestId: userTestId,
    //         questionId: questionId,
    //         answers: answers
    //     };
    //     return this._httpClient.post<any>(AppService.apiBasePath + 'user-tests/answer-question', body).pipe(
    //         map((response: any) => AppService.fromSnakeToCamel(response))
    //     );
    // }
    //
    // getQuestionGrade(userTestId: Id, questionId: Id): Observable<any> {
    //     return this._httpClient.get<any>(AppService.apiBasePath + 'user-tests/get-question-grade', {
    //         params: {
    //             userTestId,
    //             questionId
    //         }
    //     }).pipe(
    //         map((response: any) => AppService.fromSnakeToCamel(response))
    //     );
    // }
    //
    // updateQuestionFeedback(questionFeedbackId: Id, questionId: Id, publish: boolean, feedbackTypeId: QuestionFeedbackTypeEnum,
    //                        parentFeedbackId: Id, content: string): Observable<any> {
    //     const body = {
    //         questionFeedbackId: questionFeedbackId,
    //         questionId: questionId,
    //         publish: Number(publish),
    //         feedbackTypeId: feedbackTypeId,
    //         parentFeedbackId: parentFeedbackId,
    //         content: content,
    //     };
    //     return this._httpClient.put<any>(AppService.apiBasePath + 'user-tests/update-question-feedback', body).pipe(
    //         map((questionFeedback: any) => BuildService.buildQuestionFeedback(AppService.fromSnakeToCamel(questionFeedback)))
    //     );
    // }
    // deleteQuestionFeedback(questionFeedbackId: Id, toDelete: boolean): Observable<any> {
    //     return this._httpClient.delete<boolean>(AppService.apiBasePath + 'user-tests/delete-question-feedback', {
    //         params: {
    //             questionFeedbackId,
    //             toDelete: Number(toDelete)
    //         }
    //     });
    // }
    // getQuestionFeedbacks(questionId: Id, questionFeedbackId: Id): Observable<any> {
    //     return this._httpClient.get<any>(AppService.apiBasePath + 'user-tests/question-feedbacks', {
    //         params: questionFeedbackId ? {
    //             ...{questionId},
    //             questionFeedbackId
    //         } : {questionId}
    //     }).pipe(
    //         map((questionFeedbacks: any) => BuildService.buildQuestionFeedbacks(AppService.fromSnakeToCamel(questionFeedbacks)))
    //     );
    // }

}
