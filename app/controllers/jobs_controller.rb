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

  def update
    @job = Job.find(params[:id])
    jobParams = params[:job].permit!
    if @job.update(jobParams)
      render json: @job
    else 
      if @job.errors.full_messages_for(:link)[0]
        render :status => 400, json: { errors: {link: ["Url is invalid"]}}
      else
        render :status => 400, json: { errors:["Update failed"] }
      end
    end
  end
end
