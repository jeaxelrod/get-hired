class JobsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def index
    @jobs = current_user.jobs
    render json: @jobs 
  end
end
