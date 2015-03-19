class ContactsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def show
    begin
      respond_with current_user.contacts.find(params[:id])
    rescue ActiveRecord::RecordNotFound => e
      render :status => 400, json: { error: "No Contacts found" }
    end
  end

  def index
    begin
      if params[:job_application_id]
        respond_with current_user.job_applications.find(params[:job_application_id]).contacts
      elsif params[:job_id]
        respond_with current_user.jobs.find(params[:job_id]).contacts
      else
        respond_with current_user.contacts
      end
    rescue ActiveRecord::RecordNotFound => e
      render :status => 400, json: { error: "No Contacts found" }
    end
  end

  def create
    begin
      contact = current_user.contacts.build(contact_params)
      if contact.save
        render json: contact
      else
        render :status => 422, json: { error: "Unable to create contact" }
      end
    rescue ActiveRecord::RecordNotFound => e
      render :status => 422, json: { error: "Unable to create contact" }
    end
  end

  def update
    begin
      contact = current_user.contacts.find(params[:id])
      if contact.update(contact_params)
        render json: contact
      else
        render :status => 422, json: { error: "Unable to edit contact" }
      end
    rescue ActiveRecord::RecordNotFound => e
      render :status => 422, json: { error: "Unable to edit contact" }
    end
  end

  def destroy
    begin
      respond_with current_user.contacts.find(params[:id]).destroy
    rescue ActiveRecord::RecordNotFound => e
      render :status => 422, json: { error: "Unable to delete job application" }
    end
  end

  private
    
    def contact_params
      params.require(:contact).permit(:job_id, :job_application_id, :first_name, :last_name, :email, :phone_number)
    end
end
