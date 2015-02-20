describe "Jobs API" do
  include Warden::Test::Helpers
  Warden.test_mode!

  it "should return the users jobs" do
    user = FactoryGirl.create(:user)
    job1 = FactoryGirl.create(:job, user: user)
    job2 = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    get "/user/jobs"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to eq([JSON.parse(job2.to_json), JSON.parse(job1.to_json)])
  end

  it "should return no jobs if user isn't logged in" do
    user = FactoryGirl.create(:user)
    job1 = FactoryGirl.create(:job, user: user)
    job2 = FactoryGirl.create(:job, user: user)

    get "/user/jobs"

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end

  it "should create new jobs" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)
    
    post "/user/jobs", :job => { position: "Internship",
                                 company:  "Google",
                                 link:     "http://google.com" }
    expect(response).to be_success

    json = JSON.parse(response.body)
    expect(json["position"]).to eq("Internship")
    expect(json["company"]).to  eq("Google")
    expect(json["link"]).to     eq("http://google.com")

    job = user.jobs[0]
    expect(job["position"]).to eq("Internship")
    expect(job["company"]).to  eq("Google")
    expect(job["link"]).to     eq("http://google.com")
  end

  it "should not let user create a new job if not logged in" do
    post "/user/jobs", :job => { position: "Internship",
                                 company:  "Google",
                                 link:     "http://google.com" }

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end
  
  it "should edit jobs" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    newJob = { position: "Engineer", company: "Instagram" }

    login_as(user, :scope => :user)
    put "/user/jobs/#{job.id}", :job => newJob

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json["position"]).to eq(newJob[:position])
    expect(json["company"]).to  eq(newJob[:company])
    expect(json["link"]).to     eq(job.link)

    updatedJob = user.jobs[0]
    expect(updatedJob["position"]).to eq(newJob[:position])
    expect(updatedJob["company"]).to  eq(newJob[:company])
    expect(updatedJob["link"]).to      eq(job.link)
  end

  it "should respond to bad job edits" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    newJob = { link: "facebook.com" }

    login_as(user, :scope => :user)
    put "/user/jobs/#{job.id}", :job => newJob

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    updatedJob = user.jobs[0]
    expect(updatedJob.link).to_not eq(newJob[:link])
  end 

  it "should not let user edit jobs if not logged in" do
    newJob = { position: "Engineer", company: "Instagram", link:"http://instagram" }

    put "/user/jobs/1", :job => newJob

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end

  it "should invalidate improper links" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    post "/user/jobs", :job => { position: "Internship",
                                 company:  "Google",
                                 link:     "google.com" }

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"errors" => {"link" => ["is not a valid url"]}})
  end
end
