// Mission Types and Component Configuration
// This file defines which components are available for each mission type

export type MissionType =
    | 'code'           // Pure coding mission (Zone 1-2)
    | 'refactor'       // Before/After diff view (Zone 1-2)
    | 'diagram'        // Architecture diagram focused (Zone 3)
    | 'state'          // State machine visualization (Zone 4)
    | 'terminal'       // DevOps/CLI missions (Zone 6)
    | 'database'       // SQL missions (Zone 7)
    | 'hybrid';        // Multiple components (all zones)

export type ProgrammingLanguage =
    | 'python'
    | 'typescript'
    | 'javascript'
    | 'yaml'
    | 'json'
    | 'dockerfile'
    | 'sql'
    | 'bash';

export interface MissionFile {
    name: string;
    content: string;
    language: ProgrammingLanguage;
    isEntry?: boolean;
    isReadOnly?: boolean;
}

export interface MissionDiagram {
    type: 'flowchart' | 'sequence' | 'state' | 'class' | 'er';
    title: string;
    code: string;
}

export interface MissionTerminalConfig {
    welcomeMessage?: string;
    availableCommands?: string[];
    expectedCommands?: string[];
}

export interface MissionDatabaseConfig {
    schema: string;
    initialQuery?: string;
    expectedQueries?: string[];
}

export interface MissionStateConfig {
    initialState: 'closed' | 'open' | 'half-open';
    failureThreshold: number;
    successThreshold: number;
    autoPlay?: boolean;
}

export interface MissionComponents {
    showEditor?: boolean;
    showDiffViewer?: boolean;
    showDiagram?: boolean;
    showTerminal?: boolean;
    showDatabase?: boolean;
    showStateVisualizer?: boolean;
}

export interface MissionHint {
    text: string;
    code?: string;
}

export interface MissionTest {
    name: string;
    description: string;
    validation: string; // Python code to validate
}

export interface Mission {
    id: string;
    zoneId: number;
    title: string;
    titleTR?: string;
    description: string;
    descriptionTR?: string;
    type: MissionType;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    xp: number;
    timeLimit: number; // in seconds

    // Component visibility
    components: MissionComponents;

    // Content
    files: MissionFile[];
    solutionFiles?: MissionFile[];
    diagram?: MissionDiagram;
    terminalConfig?: MissionTerminalConfig;
    databaseConfig?: MissionDatabaseConfig;
    stateConfig?: MissionStateConfig;

    // Guidance
    briefing: string;
    briefingTR?: string;
    objectives: string[];
    hints: MissionHint[];
    tests: MissionTest[];

    // Links
    docsUrl?: string;
    referenceChapter?: string;
}

// Zone to Component mapping
export const ZoneComponentDefaults: Record<number, MissionComponents> = {
    1: { showEditor: true, showDiffViewer: true },
    2: { showEditor: true, showDiffViewer: true },
    3: { showEditor: true, showDiagram: true },
    4: { showEditor: true, showDiagram: true, showStateVisualizer: true },
    5: { showEditor: true, showDiagram: true },
    6: { showEditor: true, showTerminal: true, showDiagram: true },
    7: { showEditor: true, showDatabase: true, showTerminal: true },
    8: { showEditor: true, showDiagram: true, showTerminal: true },
};

// Sample missions for each zone
export const MISSIONS: Mission[] = [
    // ============================================
    // ZONE 1: Quality Attributes (Kalite Nitelikleri)
    // ============================================
    {
        id: '1.1',
        zoneId: 1,
        title: 'The Broken Report',
        titleTR: 'Bozuk Rapor',
        description: 'Fix the ReportService class that violates Single Responsibility Principle',
        descriptionTR: 'SRP ihlal eden ReportService sınıfını düzelt',
        type: 'refactor',
        difficulty: 'beginner',
        xp: 100,
        timeLimit: 600,
        components: { showEditor: true, showDiffViewer: true },
        files: [
            {
                name: 'report_service.py',
                language: 'python',
                isEntry: true,
                content: `# report_service.py
# SRP VIOLATION - Fix this class!

class ReportService:
    """
    This class handles too many responsibilities:
    1. Calculate sales data
    2. Format PDF
    3. Send email
    
    TODO: Refactor according to Single Responsibility Principle!
    """
    
    def generate_sales_data(self, start_date, end_date):
        # Fetch sales data from database
        sales = self.fetch_from_db(start_date, end_date)
        # Calculate totals
        total = sum(s.amount for s in sales)
        return {"total": total, "items": sales}
    
    def format_as_pdf(self, data):
        # PDF generation logic
        pdf = PDFDocument()
        pdf.add_title("Sales Report")
        pdf.add_table(data)
        return pdf.render()
    
    def send_via_email(self, pdf, recipients):
        # Email sending logic
        email = Email()
        email.attach(pdf)
        email.send_to(recipients)
        return True
    
    def fetch_from_db(self, start, end):
        # Simulated database call
        return []
`
            }
        ],
        solutionFiles: [
            {
                name: 'report_service.py',
                language: 'python',
                isEntry: true,
                content: `# report_service.py
# SRP COMPLIANT - Each class has one responsibility!

class SalesDataRepository:
    """Responsibility: Data Access"""
    
    def fetch_sales(self, start_date, end_date):
        return []

class SalesReportGenerator:
    """Responsibility: Generate report data"""
    
    def __init__(self, repository):
        self.repository = repository
    
    def generate(self, start_date, end_date):
        sales = self.repository.fetch_sales(start_date, end_date)
        total = sum(s.amount for s in sales)
        return {"total": total, "items": sales}

class ReportFormatter:
    """Responsibility: Format report as PDF"""
    
    def format_as_pdf(self, data):
        pdf = PDFDocument()
        pdf.add_title("Sales Report")
        pdf.add_table(data)
        return pdf.render()

class ReportDistributor:
    """Responsibility: Send report via email"""
    
    def send_via_email(self, pdf, recipients):
        email = Email()
        email.attach(pdf)
        email.send_to(recipients)
        return True
`
            }
        ],
        briefing: 'Commander Eve here. Our ReportService is a mess - it generates data, formats PDFs, AND sends emails. That\'s three jobs for one class! Split it according to SRP.',
        briefingTR: 'Komutan Eve burada. ReportService\'imiz karmaşık - veri üretiyor, PDF formatliyor VE email gönderiyor. Tek sınıf için üç iş! SRP\'ye göre böl.',
        objectives: [
            'Create separate classes for each responsibility',
            'SalesDataRepository for data access',
            'SalesReportGenerator for business logic',
            'ReportFormatter for PDF generation',
            'ReportDistributor for email sending'
        ],
        hints: [
            { text: 'Each class should only have one reason to change.' },
            { text: 'Report generation, formatting, and distribution are different responsibilities.' },
            { text: 'Consider creating three separate classes: Generator, Formatter, Distributor' }
        ],
        tests: [
            { name: 'test_srp_compliance', description: 'Single responsibility check', validation: 'len([c for c in code if "class " in c]) >= 3' },
            { name: 'test_generator_class', description: 'SalesReportGenerator exists', validation: '"SalesReportGenerator" in code' },
            { name: 'test_formatter_class', description: 'ReportFormatter exists', validation: '"ReportFormatter" in code' },
            { name: 'test_distributor_class', description: 'ReportDistributor exists', validation: '"ReportDistributor" in code' }
        ],
        docsUrl: '/docs/solid/srp',
        referenceChapter: 'Bölüm 1.2'
    },

    // ============================================
    // ZONE 4: Resilience & Fault Tolerance
    // ============================================
    {
        id: '4.1',
        zoneId: 4,
        title: 'The Fail Whale',
        titleTR: 'Başarısız Balina',
        description: 'Implement Circuit Breaker pattern to protect your service',
        descriptionTR: 'Servisinizi korumak için Circuit Breaker pattern uygulayın',
        type: 'state',
        difficulty: 'intermediate',
        xp: 200,
        timeLimit: 900,
        components: { showEditor: true, showStateVisualizer: true, showDiagram: true },
        files: [
            {
                name: 'circuit_breaker.py',
                language: 'python',
                isEntry: true,
                content: `# circuit_breaker.py
# Implement the Circuit Breaker pattern

from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30):
        # TODO: Initialize state variables
        pass
    
    def call(self, func, *args, **kwargs):
        # TODO: Implement circuit breaker logic
        # 1. If OPEN, check if timeout expired
        # 2. If CLOSED or HALF_OPEN, try the call
        # 3. Track failures and successes
        # 4. Transition states appropriately
        pass
    
    def _record_success(self):
        # TODO: Handle successful call
        pass
    
    def _record_failure(self):
        # TODO: Handle failed call
        pass
`
            }
        ],
        diagram: {
            type: 'state',
            title: 'Circuit Breaker States',
            code: `stateDiagram-v2
    direction LR
    
    [*] --> Closed
    
    state Closed {
        [*] --> Monitoring
        Monitoring --> Monitoring: Success (reset counter)
        Monitoring --> FailureCount: Failure
        FailureCount --> Monitoring: Success
        FailureCount --> TripCircuit: failures >= threshold
    }
    
    Closed --> Open: Trip Circuit
    
    state Open {
        [*] --> Rejecting
        Rejecting --> Rejecting: Reject all requests
        Rejecting --> TimeoutCheck: Check timeout
    }
    
    Open --> HalfOpen: Timeout expired
    
    state HalfOpen {
        [*] --> Testing
        Testing --> ProbeSuccess: Test request succeeds
        Testing --> ProbeFailure: Test request fails
    }
    
    HalfOpen --> Closed: Probe Success
    HalfOpen --> Open: Probe Failure
    
    note right of Closed
        Normal operation
        Requests pass through
        Track failure count
    end note
    
    note right of Open
        Fail fast mode
        Protect downstream
        Wait for recovery
    end note
    
    note right of HalfOpen
        Recovery testing
        Limited traffic
        Single test request
    end note`
        },
        stateConfig: {
            initialState: 'closed',
            failureThreshold: 3,
            successThreshold: 2,
            autoPlay: false
        },
        briefing: 'The downstream payment service is flaky. We need a Circuit Breaker to stop cascading failures. Watch the state machine and implement accordingly.',
        briefingTR: 'Downstream ödeme servisi sorunlu. Kaskad hataları durdurmak için Circuit Breaker lazım. State machine\'i izle ve buna göre uygula.',
        objectives: [
            'Track failure count in CLOSED state',
            'Open circuit after threshold failures',
            'Wait for timeout before trying HALF_OPEN',
            'Close circuit after success in HALF_OPEN'
        ],
        hints: [
            { text: 'Use a failure counter that resets on success' },
            { text: 'Store the time when circuit opened for timeout calculation' },
            { text: 'In HALF_OPEN, one failure should re-open the circuit' }
        ],
        tests: [
            { name: 'test_initial_state', description: 'Starts in CLOSED', validation: '"CLOSED" in str(cb.state)' },
            { name: 'test_opens_after_failures', description: 'Opens after threshold', validation: 'cb.state == CircuitState.OPEN' },
            { name: 'test_half_open_after_timeout', description: 'Transitions to HALF_OPEN', validation: 'True' }
        ],
        docsUrl: '/docs/resilience/circuit-breaker',
        referenceChapter: 'Bölüm 4.1'
    },

    // ============================================
    // ZONE 6: Cloud Native & DevOps
    // ============================================
    {
        id: '6.1',
        zoneId: 6,
        title: 'Container Orchestration',
        titleTR: 'Konteyner Orkestrasyonu',
        description: 'Deploy a microservice to Kubernetes',
        descriptionTR: 'Bir mikroservisi Kubernetes\'e deploy edin',
        type: 'terminal',
        difficulty: 'advanced',
        xp: 300,
        timeLimit: 1200,
        components: { showEditor: true, showTerminal: true, showDiagram: true },
        files: [
            {
                name: 'deployment.yaml',
                language: 'yaml',
                isEntry: true,
                content: `# deployment.yaml
# TODO: Complete the Kubernetes deployment

apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: # TODO: Set replica count
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api
        image: # TODO: Set image
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        # TODO: Add health checks
`
            },
            {
                name: 'service.yaml',
                language: 'yaml',
                content: `# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-server
spec:
  selector:
    app: api-server
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
`
            },
            {
                name: 'Dockerfile',
                language: 'dockerfile',
                content: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "app.py"]
`
            }
        ],
        diagram: {
            type: 'flowchart',
            title: 'Kubernetes Architecture',
            code: `graph TB
    LB[Load Balancer]
    subgraph Cluster
        SVC[Service]
        subgraph Deployment
            P1[Pod 1]
            P2[Pod 2]
            P3[Pod 3]
        end
    end
    LB --> SVC
    SVC --> P1
    SVC --> P2
    SVC --> P3`
        },
        terminalConfig: {
            welcomeMessage: 'Kubernetes Terminal - Use kubectl to deploy your application',
            availableCommands: ['kubectl', 'docker', 'ls', 'cat'],
            expectedCommands: ['kubectl apply -f deployment.yaml', 'kubectl get pods']
        },
        briefing: 'Time to containerize and orchestrate! Complete the deployment.yaml and use kubectl to deploy to the cluster.',
        briefingTR: 'Konteynerize ve orkestra zamanı! deployment.yaml\'ı tamamla ve cluster\'a deploy etmek için kubectl kullan.',
        objectives: [
            'Set replica count to 3',
            'Configure container image',
            'Add liveness and readiness probes',
            'Apply deployment with kubectl'
        ],
        hints: [
            { text: 'Replicas should be at least 3 for high availability' },
            { text: 'Add livenessProbe and readinessProbe for health checks' },
            { text: 'Use kubectl apply -f deployment.yaml to deploy' }
        ],
        tests: [
            { name: 'test_replicas', description: 'Has 3 replicas', validation: '"replicas: 3" in code' },
            { name: 'test_health_check', description: 'Has health probes', validation: '"livenessProbe" in code' }
        ],
        docsUrl: '/docs/cloud/kubernetes',
        referenceChapter: 'Bölüm 6.2'
    },

    // ============================================
    // ZONE 7: Data Strategies
    // ============================================
    {
        id: '7.1',
        zoneId: 7,
        title: 'The Sharding Challenge',
        titleTR: 'Sharding Mücadelesi',
        description: 'Design and query a sharded database',
        descriptionTR: 'Sharded bir veritabanı tasarla ve sorgula',
        type: 'database',
        difficulty: 'expert',
        xp: 400,
        timeLimit: 1500,
        components: { showEditor: true, showDatabase: true, showDiagram: true },
        files: [
            {
                name: 'sharding_strategy.py',
                language: 'python',
                isEntry: true,
                content: `# sharding_strategy.py
# Implement a sharding strategy for user data

class ShardingStrategy:
    def __init__(self, num_shards=4):
        self.num_shards = num_shards
    
    def get_shard(self, user_id: int) -> int:
        """
        Determine which shard should store this user's data.
        
        TODO: Implement consistent hashing or modulo-based sharding
        """
        pass
    
    def get_all_shards_for_query(self, query_type: str) -> list:
        """
        For queries that need to span multiple shards.
        
        TODO: Return list of shards to query
        """
        pass
`
            }
        ],
        diagram: {
            type: 'flowchart',
            title: 'Sharding Architecture',
            code: `graph TB
    Router[Shard Router]
    subgraph Shards
        S1[(Shard 1)]
        S2[(Shard 2)]
        S3[(Shard 3)]
        S4[(Shard 4)]
    end
    Router --> S1
    Router --> S2
    Router --> S3
    Router --> S4`
        },
        databaseConfig: {
            schema: `
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    shard_key INTEGER
);

INSERT INTO users VALUES 
    (1, 'Alice', 'alice@example.com', 1),
    (2, 'Bob', 'bob@example.com', 2),
    (3, 'Charlie', 'charlie@example.com', 3),
    (4, 'David', 'david@example.com', 0);
`,
            initialQuery: 'SELECT * FROM users WHERE shard_key = ?;',
            expectedQueries: [
                'SELECT * FROM users WHERE shard_key = 1',
                'SELECT COUNT(*) FROM users GROUP BY shard_key'
            ]
        },
        briefing: 'Our user database is hitting limits. Time to implement sharding! Design a strategy and test your queries.',
        briefingTR: 'Kullanıcı veritabanımız limitlere ulaşıyor. Sharding zamanı! Strateji tasarla ve sorgularını test et.',
        objectives: [
            'Implement shard key calculation',
            'Route queries to correct shard',
            'Handle cross-shard queries'
        ],
        hints: [
            { text: 'user_id % num_shards gives a simple shard key' },
            { text: 'Consider consistent hashing for better distribution' },
            { text: 'Cross-shard queries need scatter-gather pattern' }
        ],
        tests: [
            { name: 'test_shard_calculation', description: 'Correct shard routing', validation: 'get_shard(1) in range(4)' },
            { name: 'test_consistent', description: 'Same ID same shard', validation: 'get_shard(5) == get_shard(5)' }
        ],
        docsUrl: '/docs/data/sharding',
        referenceChapter: 'Bölüm 7.3'
    }
];

// Helper to get mission by ID
export function getMissionById(id: string): Mission | undefined {
    return MISSIONS.find(m => m.id === id);
}

// Helper to get missions by zone
export function getMissionsByZone(zoneId: number): Mission[] {
    return MISSIONS.filter(m => m.zoneId === zoneId);
}

// Helper to get default components for a zone
export function getZoneComponents(zoneId: number): MissionComponents {
    return ZoneComponentDefaults[zoneId] || { showEditor: true };
}
