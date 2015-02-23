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
end
