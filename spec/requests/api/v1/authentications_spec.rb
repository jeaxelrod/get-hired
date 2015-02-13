describe "Authentication API" do
  include Warden::Test::Helpers
  Warden.test_mode! 

  it "should return no user if current user isn't logged in" do
    get '/current_user'
    
    expect(response).to be_success
    expect(response.body).to eq("null")
  end

  it "should return the current user" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    get '/current_user'

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json["email"]).to eq(user.email)
    expect(json["first_name"]).to eq(user.first_name)
    expect(json["last_name"]).to eq(user.last_name)
  end

  it "logs in a user with proper creditials" do
    user = FactoryGirl.create(:user)

    post '/users/sign_in.json', user: {email: user.email, password: user.password}

    expect(response).to be_success
    json = JSON.parse(response.body)
    # Thoughts: wondering if better way to test that user actually logged in
    expect(json["email"]).to eq(user.email)
    expect(json["first_name"]).to eq(user.first_name)
    expect(json["last_name"]).to eq(user.last_name)
  end

  it "fails to log in a user" do
    user = FactoryGirl.create(:user)

    post '/users/sign_in.json', user: {email: user.email, password: user.password + "1"}

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json["error"]).to eq("Invalid email or password.")
  end

  it "logs out a user" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    delete '/users/sign_out.json'

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["info"]).to eq("Logged out")
  end
end
