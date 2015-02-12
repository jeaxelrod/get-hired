class SessionsController < Devise::SessionsController 
  
  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message :notice, :signed_out if signed_out && is_flashing_format?
    yield if block_given?
    render :status => 200,
           :json => { :success => true,
                      :info => "Logged out",
           }
  end
end
