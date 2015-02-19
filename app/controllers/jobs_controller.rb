class JobsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def index
    @jobs = current_user.jobs
    render json: @jobs 
  end

  def create
    job = params[:job]
    respond_with current_user.jobs.create(position: job["position"], 
                                          company:  job["company"], 
                                          link:     job["link"]) 
  end
end
