export interface IURLController {
  createShortURL(req: Request, res: Response): Promise<Response> 
  getAnalytics(req: Request, res: Response): Promise<Response>;
}
