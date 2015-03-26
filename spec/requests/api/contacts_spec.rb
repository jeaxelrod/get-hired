describe "Contacts API" do
  include Warden::Test::Helpers
  Warden.test_mode!
  
  it "should return a contact" do
    contact = FactoryGirl.create(:contact)
    user = contact.user
    login_as(user, :scope => :user)

    get "/user/contacts/#{contact.id}"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to eq(JSON.parse(contact.to_json))
  end

  it "should fail to return a contact if it doesn't exist" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    get "/user/contacts/1"

    expect(response).to_not be_success
  end

  it "should fail to return a contact if the user isn't logged in" do
    contact = FactoryGirl.create(:contact)

    get "/user/contacts/#{contact.id}"

    expect(response).to_not be_success
  end

  it "should return a job application's contacts"  do
    contact = FactoryGirl.create(:contact)
    app = contact.job_application
    user = contact.user
    user.contacts.create()
    login_as(user, :scope => :user)

    get "/user/job_applications/#{app.id}/contacts"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json.length).to eq(1)
    expect(json[0]).to eq(JSON.parse(contact.to_json))
  end

  it "should return all contacts for a user" do
    contact = FactoryGirl.create(:contact)
    user = contact.user
    login_as(user, :scope => :user)

    get "/user/contacts"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json[0]).to eq(JSON.parse(contact.to_json))
  end

  it "should return all contacts for a job" do
    contact = FactoryGirl.create(:contact)
    job = contact.job
    user = contact.user
    contact2 =  job.contacts.create(user_id: user.id)
    login_as(user, :scope => :user)

    get "/user/jobs/#{job.id}/contacts"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json.length).to eq(2)
    expect(json[0]).to eq(JSON.parse(contact2.to_json))
    expect(json[1]).to eq(JSON.parse(contact.to_json))
  end

  it "should create new contacts" do
    app = FactoryGirl.create(:job_application)
    job = app.job
    user = app.user
    new_contact = { job_application_id: app.id,
                    job_id:             job.id,
                    first_name:         "First",
                    last_name:          "Last",
                    email:              "user@email.com",
                    phone_number:       1234567890 }
    login_as(user, :scope => :user)

    post "/user/contacts", :contact => new_contact

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to eq(JSON.parse(user.contacts[0].to_json))
    expect(json).to eq(JSON.parse(app.contacts[0].to_json))
    expect(json).to eq(JSON.parse(job.contacts[0].to_json))
  end

  it "should edit a contact" do
    contact = FactoryGirl.create(:contact)
    user = contact.user
    edited_contact = { first_name: "Meow",
                       last_name:  "Kitties" }
    login_as(user, :scope => :user)

    put "/user/contacts/#{contact.id}", :contact => edited_contact

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json["first_name"]).to eq(edited_contact[:first_name])
    expect(json["last_name"]).to  eq(edited_contact[:last_name])
    
    expect(user.contacts[0].to_json).to  include(edited_contact[:first_name])
    expect(user.contacts[0].to_json).to   include(edited_contact[:last_name])
  end

  it "should delete a contact" do
    contact = FactoryGirl.create(:contact)
    user = contact.user
    login_as(user, :scope => :user)
    
    delete "/user/contacts/#{contact.id}"

    expect(response).to be_success
    expect(user.contacts.where(id: contact.id)).to be_empty
  end
end
