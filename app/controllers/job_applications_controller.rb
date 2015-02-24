class JobApplicationsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def show
    begin
      respond_with current_user.jobs.find(params[:job_id]).job_applications.find(params[:id])
    rescue ActiveRecord::RecordNotFound => e
      render :status => 400, json: { error: "No Job Applications found" }
    end
  end

  def index
    begin
      respond_with current_user.jobs.find(params[:job_id]).job_applications
    rescue ActiveRecord::RecordNotFound => e
      render :status => 400, json: { error: "No Job Applications found" }
    end
  end

  def user_index
    begin
      respond_with current_user.job_applications
    rescue ActiveRecord::RecordNotFound => e
      render :status => 400, json: { error: "No Job Applications found" }
    end
  end

  def create 
    begin
      job = current_user.jobs.find(params[:job_id])
      app = job.job_applications.build(job_application_params)
      app.user_id = current_user.id
      if app.save
        render json: app
      else
        render :status => 422, json: { error: "Unable to create job application" }
      end
    rescue ActiveRecord::RecordNotFound => e
      render :status => 422, json: { error: "Unable to create job application" }
    end
  end

  private

    def job_application_params
      params.require(:job_application).permit(:date_applied, :comments, :communication, :status)
    end
end
