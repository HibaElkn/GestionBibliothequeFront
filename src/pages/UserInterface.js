import React, { useState, useEffect } from 'react';
import UserBooks from './UserBooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserInterface.css';
import documentService from '../services/documentService';

const categories = ['Fiction', 'Classique', 'Fantastique', 'Philosophie', 'Aventure', 'Historique', 'Poésie'];
const languages = ['Français', 'Anglais', 'Espagnol', 'Russe', 'Grec ancien'];

const UserInterface = () => {
    const [view, setView] = useState('catalogue');
    const [filters, setFilters] = useState({
        keywords: '',
        availableOnly: false,
        category: '',
        language: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const fetchedDocuments = await documentService.getAllDocuments();
                setDocuments(fetchedDocuments);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        };

        fetchDocuments();
    }, []);


    const handleAvailabilityChange = () => {
        setFilters((prevFilters) => ({ ...prevFilters, availableOnly: !prevFilters.availableOnly }));
    };

    const handleKeywordChange = (event) => {
        setFilters((prevFilters) => ({ ...prevFilters, keywords: event.target.value }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const filteredBooks = documents.filter((book) => {
        const matchesAvailability = !filters.availableOnly || book.available;
        const matchesKeywords = filters.keywords === '' || book.title.toLowerCase().includes(filters.keywords.toLowerCase()) || book.author.toLowerCase().includes(filters.keywords.toLowerCase());
        const matchesCategory = filters.category === '' || book.category === filters.category;
        const matchesLanguage = filters.language === '' || book.language === filters.language;
        return matchesAvailability && matchesKeywords && matchesCategory && matchesLanguage;
    });

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container user-interface">
        

            {view === 'catalogue' && (
                <>
                    <div className="row">
                        <div className="col-md-1">
                
                        </div>
                        <div className="col-md-9">
                            <UserBooks booksData={currentBooks} />
                            <nav className="mt-2">
                                <ul className="pagination justify-content-center">
                                    {[...Array(totalPages).keys()].map((number) => (
                                        <li
                                            key={number}
                                            className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                                            onClick={() => handlePageChange(number + 1)}
                                        >
                                            <span className="page-link">{number + 1}</span>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserInterface;
