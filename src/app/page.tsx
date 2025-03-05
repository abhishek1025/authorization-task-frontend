import {Button} from "antd";

export default async function Home() {


    return (
        <div className='space-y-4 p-12'>
            <section className="text-center space-y-6">
                <h1 className="text-6xl font-bold tracking-tight">
                    Secure & Scalable <span className="text-primary">Authorization System</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A dynamic role-based authentication and authorization system powered by <strong> .NET  </strong> and
                    <strong> Next.js </strong>.
                    Built with security, scalability, and flexibility in mind—designed to handle user roles,
                    permissions, JWT authentication, and API access control efficiently.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="large" type="primary">
                        Get Started
                    </Button>
                    <Button size="large">
                        Documentation
                    </Button>
                </div>
            </section>

        </div>
    );
}

